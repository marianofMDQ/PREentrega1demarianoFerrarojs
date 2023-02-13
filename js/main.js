
alert("Queres saber cuanto falta para tu evento, nosotros te ayudamos")
let events=[];
let arr=[];//cargo informacion

const eventName = document.querySelector("#eventName");
const eventDate = document.querySelector("#eventDate");
const buttonAdd = document.querySelector("#bAdd");
const eventsContainer= document.querySelector("#eventsContainer");

document.querySelector("form").addEventListener("submit",(e)=>{
    e.preventDefault();
    addEvent();
});

function addEvent(){
    if(eventName.value == "" || eventDate.value == ""){
        return; //valido en caso que este vacio ,no retorna nada
    }
 let contador;   


if(deteDiff (eventDate.value)<0){///funcion que valida en caso de haya una fecha anterior a la actual
    return;
}

const newEvent = {///creo un objeto
    id:(Math.random()*100).toString(36).slice(3),
    name:eventName.value,
    date:eventDate.value,

};
 events.unshift(newEvent);///agrego elementos aun arreglo al inicio

 eventName.value="";
 renderEvents();

}

function deteDiff(d){
    const targetDate = new Date(d);
    const today = new Date();
    const diference =targetDate.getTime() - today.getTime();///resto la diferrncia de dias
    const days = Math.ceil(diference / (1000 *3600 *24));//segundos,minutos,dia
    return days;
}

function renderEvents(){
    const eventsHTML =events.map(event=>{
        return `
            <div class="event">
                <div class = "days">
                    <span class ="days-number">${deteDiff(event.date)}</span>
                    <span class ="days-text">dias</span>
                    </div>

                    <div class="event-name">${event.name}</div>
                    <div class="event-date">${event.date}</div>
                    <div class="actions">
                        <button class="bDelete"data-id="${event.id}">Eliminar</button>
                    </div>
                </div>    
        
                `;

             
       });
       eventsContainer.innerHTML = eventsHTML.join("");  
       document.querySelectorAll(".bDelete").forEach((button)=>{
        button.addEventListener("click",(e) =>{
            const id =button.getAttribute("data-id");
            events=events.filter((event) => event.id != id  );

            renderEvents();
        });
       });

}