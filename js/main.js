
let namee=prompt("Bienvenido a Electrohogar, Cual es su nombre?");
alert(" que disfrute su compra" + " " + namee);


const db={///db seria la base supuesta base de datos en la que estarian los articulos

    methods:{///metodos
        find:(id) => {
            return db.items.find(item => item.id==id); //retorna elemento segun id
        },
        remove:(items)=> { //aca removemos los elementos de nuestra base de datos
            items.forEach(item => {
                const product=db.methods.find(item.id);
                product.qty=product.qty -item.qty
            });{
                
            };
            console.log(db);
        },

    },
    items:[

        {
            id:0,
            titulo:'Smart TV LG 40',
            precio:80000,
            qty:5 ,      ///stock
        },
        {
            id:1,
            titulo:"Cafetera Philips",
            precio:10000,
            qty:4 ,      ///stock
        },
        {
            id:2,
            titulo:"Ventilador Liliana",
            precio:8000,
            qty:15 ,      ///stock
        },
        {
            id:3,
            titulo:"Lavarropas Giant",
            precio:120000,
            qty:6 ,      ///stock
        },
        {
            id:4,
            titulo:"Heladera Philco",
            precio:150000,
            qty:7 ,      ///stock
        },
    ]

}

const shoppingCart ={ ///toma como referencia mi base de datos para buscar elementos

    items:[],///mi carrito esta vacio al inicio
    methods:{

        add:(id,qty)=>{
            const cartItem =shoppingCart.methods.get(id);
            if(cartItem){
                if(shoppingCart.methods.hasInventory(id,qty + cartItem.qty)){///sumo lo que tengo en mi carrito + lo que adiciono
                        cartItem.qty += qty; //actualiza mi carrito

                }else{
                    alert('no hay inventario suficiente');
                }
            }else{
                shoppingCart.items.push({id,qty})
            }
        },///añado elemento al carrito

        remove:(id,qty)=>{
            const cartItem=shoppingCart.methods.get(id);
            if(cartItem.qty -qty>0){
                cartItem.qty-=qty;
            }else{
                shoppingCart.items=shoppingCart.items.filter(item=>item.id != id);
            }
        }, ///borrar elemento del carrito

        count:()=>{
            return shoppingCart.items.reduce((acc,item)=> acc + item.qty,0) ///acc actua como acumulador
        },
        get:(id)=>{
            const index= shoppingCart.items.findIndex(item=>item.id==id)
            return index >= 0 ? shoppingCart.items[index]:null;//condicional
        },///regreso elemento segun id que busco
        getTotal:()=>{
            
            const total= shoppingCart.items.reduce((acc,item)=>{
                const found=db.methods.find(item.id);
                return (acc + found.precio * item.qty)
            },0);
            return total;
        },
        hasInventory:(id,qty)=>{
            return db.items.find(item => item.id == id).qty-qty>=0 //cuando busco el elemento acceso a su propiedad qyt(cantidad)
                                                                    ///entonces si yo le descuento ,me devuelve mi inventario true
        },///suma de los elementos del carrito
        purchase:()=>{
            db.methods.remove(shoppingCart.items);
            shoppingCart.items=[];
            alert("gracias por su compra" + " " + namee); 
        },///compra todo lo que hay en el carrito

    },
};

renderStore();
function renderStore(){
    const html =db.items.map(item => {
        return`
            <div class="item">
            <div class="titulo">${item.titulo}</div>
            <div class="precio">${item.precio}</div>
            <div class="qty">${item.qty}unidades</div>

            <div class="actions">
                <button class ="add" data-id="${item.id}">Agregar al carrito </button>
            </div>
                </div>
            `;
    });

    document.querySelector("#store-container").innerHTML=html.join("");
    document.querySelectorAll('.item .actions .add').forEach(button => {
        button.addEventListener('click', e =>{
            const id= parseInt(button.getAttribute('data-id'));
            const item =db.methods.find(id);
            if(item && item.qty -1 >0){
              ///añadir a shopping cart  

            shoppingCart.methods.add(id,1);
            renderShoppingCart();
            }else{
                console.log('ya no hay inventario');
            }

        });
    });
}

    function renderShoppingCart(){
        const html = shoppingCart.items.map(item =>{
            const dbItem =db.methods.find(item.id);
            return `
                <div class="item">
                <div class="titulo">${dbItem.titulo}</div>
                <div class="precio">${dbItem.precio}</div>
                <div class="qty">${item.qty} unidades</div>
                <div class="subtotal">
                    Subtotal:${(item.qty *dbItem.price)}
                </div>
                <div class="actions">
                    <button class ="AddOne" data-id="${item.id}">-</button>
                    <button class="One" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
        });

        const closeButton=`
            <div class="cart-header">
                <button class= "bClose">Cerrar</button>
            </div>
        `;
        const purchaseButton =
            shoppingCart.items.length > 0 ?
        `
            <div class="cart-actions">
                <button id="bPurchase">Comprar</button>
            </div>
        `
        :"";//imprime un string vacio si no se cumple el condicional

        const total =shoppingCart.methods.getTotal();
        const totalContainer= `<div class="total">Total: ${total}</div>`;

        const shoppingCartContainer =document.querySelector("#shopping-cart-container");
    

        shoppingCartContainer.classList.remove("hide");
        shoppingCartContainer.classList.add("show");

        shoppingCartContainer.innerHTML= 
        closeButton + html.join("")+totalContainer+purchaseButton;

        document.querySelectorAll('.AddOne').forEach(button =>{
            button.addEventListener('click',(e) => {
                const id =parseInt(button.getAttribute('data-id'));
                shoppingCart.methods.remove(id,1);
                renderShoppingCart();
            });
        });

        document.querySelectorAll('.One').forEach(button =>{
            button.addEventListener('click',(e) => {
                const id =parseInt(button.getAttribute('data-id'));
                shoppingCart.methods.add(id,1);
                renderShoppingCart();
            });
        });

        document.querySelector('.bClose').addEventListener('click',e =>{
            shoppingCartContainer.classList.remove("show");//para que no se vea el panel
            shoppingCartContainer.classList.add("hide");
        });

        const bPurchase =document.querySelector('#bPurchase');
        if(bPurchase){
            bPurchase.addEventListener("click",(e)=>{
                shoppingCart.methods.purchase();
                renderStore();
                renderShoppingCart();
            })
        }

    }
