class Carousel{
    /**
     * Ce callback
     * @callback moveCallback
     * @param {number} index 
     */
    /**
     * Description
     * @param {HTMLElement} element
     * @param {Object} options={}
     * @param {string} [options.slidesToScroll = 1] - nombre d'element a faire defiler
     * @param {String} [options.slidesVisible = 1] - nombre d'element visible dans un slide
     * @param {boolean} [options.loop = false] - dois-t on boucler en fin de carousel? 
     * @param {boolean} [options.pagination = false] - dois-t on afficher la pagination ou pas? 
     * @param {boolean} [options.navigation = true] - pour afficher ou pas les fleches de navigations 
     * @param {boolean} [options.infinite = false] - Pour rendre le carousel scrolable a l'infinie ou pas 
     * @returns {any}
     */
    constructor(element,options = {}){
        this.element = element;
        this.options = Object.assign({},{
            //options par defaut
            slidesVisible : 1,
            slidesToScroll : 1,
            loop : false,
            pagination : false,
            navigation : true,
            infinite : false
        },options);
        let children = [].slice.call(element.children) 
        this.isMobile = false
        this.currentItems = 0;

        this.root = this.createDivWithClass('carousele')
        this.root.setAttribute('tabindex','0')
        this.container = this.createDivWithClass('carousel__container')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)

        

        this.items =children.map(child => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        });
        
        this.moveCallbacks = []; 
        this.setStyle()
        if (this.options.navigation) {
            this.createNavigation();
        }
        if (this.options.pagination) { 
            this.createPagination();
        }
        //evenement

        this.moveCallbacks.forEach(cb=>cb(0))
        this.onWindowResize();
        window.addEventListener('resize',this.onWindowResize.bind(this))
        this.root.addEventListener('keyup',e=>{
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next();
            }else if(e.key === 'ArrowLeft' || e.key === 'Left'){
                this.prev();
            }
        })

    }
    /**
     * Description
     * @param {string} className - nom de la class a donné au div créé
     * @returns {HTMLElement}
     */
    createDivWithClass(className){
        let div = document.createElement('div');
        div.setAttribute('class',className);
        return div
    }
    /**
     * Description : 
     * Applique les bonnes dimensions aux elements du carousel
     * @returns {any}
     */
    setStyle(){
        let ration = this.items.length /this.slidesVisible  
        this.container.style.width = ration * 100 +'%'
        this.items.forEach(item => {
            item.style.width=((100/this.slidesVisible)/ration)+ "%"
            
        });

    }

    /**
     * Description : 
     * Cree les deux fleches pour naviger sur le carousel
     * @returns {any}
     */
    createNavigation(){
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click',this.next.bind(this))
        prevButton.addEventListener('click',this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }
        this.onMove(index=>{
            if(index===0){
                prevButton.classList.add('carousel__prev--hidden')
            }else{
                prevButton.classList.remove('carousel__prev--hidden')
            }
            if (this.items[this.currentItems + this.slidesVisible] === undefined ) {
                nextButton.classList.add('carousel__next--hidden')
            }else{
                nextButton.classList.remove('carousel__next--hidden')
            }
        })
    }
    /**
     * Description : 
     * Cree le point pour montre la pagination c'est a dire l'item sur le quel on est
     * @returns {any}
     */
    createPagination(){
        let pagination = this.createDivWithClass('carousel__pagination')
        let buttons = [];
        this.root.appendChild(pagination)
        for (let i = 0; i < this.items.length; i = i + this.options.slidesToScroll) {
            let button = this.createDivWithClass('carousel__pagination__button')
            button.addEventListener('click',()=>this.gotoItem(i))
            pagination.appendChild(button)
            buttons.push(button)
        }
        this.onMove(index=>{
            let activeButton = buttons[Math.floor(index /this.options.slidesToScroll)]
            if (activeButton) {
                buttons.forEach(button=> button.classList.remove('carousel__pagination__button--active'))
                activeButton.classList.add('carousel__pagination__button--active')
            } 
        })
    }
    next(){
        this.gotoItem(this.currentItems + this.slidesToScroll)
        
    }
    prev(){
        this.gotoItem(this.currentItems - this.slidesToScroll)
    }
    /**
     * Description : 
     * Deplace le carousel vers l'element ciblé
     * @param {number} index - numero de l'element ciblé qui doit etre visible
     * @returns {any}
     */
    gotoItem(index){   
        if (index < 0) {
            if(this.options.loop){
                index  = this.items.length - this.slidesVisible
            }else{
                return
            }
        }else if(index >= this.items.length || (this.items[this.currentItems + this.slidesVisible] === undefined && index > this.currentItems) ){
            if(this.options.loop){ 
                index = 0
            }else{
                return
            }
        }
        
        let translateX = index * -100/ this.items.length
        this.container.style.transform='translate3d('+translateX+'%,0,0)'
        this.currentItems = index; 
        this.moveCallbacks.forEach(cb=>cb(index))
    }
    /**
     * Description
     * @param {moveCallback} clb
     * @returns {any}
     */
    onMove(clb){ 
        this.moveCallbacks.push(clb)
    }

    onWindowResize(){
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle();
            this.moveCallbacks.forEach(cb=>cb(this.currentItems))
        }
    }
    /**
     * Description
     * @returns {number}
     */
    get slidesToScroll(){
        return this.isMobile ? 1:this.options.slidesToScroll
    }
    get slidesVisible(){
        return this.isMobile ? 1:this.options.slidesVisible
    }
}


document.addEventListener('DOMContentLoaded',()=>{
    new Carousel(document.getElementById('carousel'),{
        slidesToScroll : 2,
        slidesVisible : 3,
        loop : false,
        pagination:true
    })
    new Carousel(document.getElementById('carousel2'),{
        slidesToScroll : 1,
        slidesVisible : 2,
        loop : true,
        infinite:true

    }) 
})