const _=document.querySelector(".js__list_all"),n=document.querySelector(".js__list_favourites"),v=document.querySelector(".js__input_search"),p=document.querySelector(".js__button_search"),y=document.querySelector(".js__reset");let i=[],r=[],l=[];const d=JSON.parse(localStorage.getItem("favourites"));g();k();p.addEventListener("click",j);y.addEventListener("click",L);function j(e){e.preventDefault();let t=v.value;fetch(`//api.disneyapi.dev/character?name=${t}`).then(a=>a.json()).then(a=>{if(_.innerHTML="",Array.isArray(a.data)){l=a.data;for(const s of l)o(s)}else o(a.data)})}function C(e){const t=e.currentTarget;u(t)}function S(e){const t=e.currentTarget.parentNode.parentNode;u(t)}function L(){n.innerHTML="",r=[],localStorage.setItem("favourites",JSON.stringify(r))}function u(e){const t=parseInt(e.dataset.id),a=e.querySelector(".characters__card");let s;fetch(`//api.disneyapi.dev/character/${t}`).then(c=>c.json()).then(c=>{s=c.data,q(a,s)})}function g(){fetch("//api.disneyapi.dev/character?pageSize=50").then(e=>e.json()).then(e=>{i=e.data;for(const t of i)o(t)})}function o(e){_.appendChild(f(e));const t=document.querySelectorAll(".js__character__card");for(const a of t)a.closest(".js__list_favourites")||(a.addEventListener("click",C),a.classList.add("clickable"))}function f(e){const t=document.createElement("li");return t.setAttribute("data-id",e._id),t.setAttribute("data-name",e.name),t.classList.add("js__character__card"),t.insertAdjacentHTML("afterbegin",`<div class="characters__card"><h3 class="characters__card__close js__card__close"></h3><img class="characters__card__img" src="${e.imageUrl?e.imageUrl:"https://via.placeholder.com/120x120/cfe2f3/351c75/?text=Disney"}" alt="Picture of ${e.name}"><h3 class="characters__card__name js__card__name">${e.name}</h3></div>`),t}function k(){if(d!==null)for(const e of d)h(e)}function q(e,t){const a=n.querySelector(`[data-id="${t._id}"]`);!e.classList.contains("favourite")&&!a&&e.closest(".js__list_all")?(e.classList.add("favourite"),h(t)):!e.classList.contains("favourite")&&a&&e.closest(".js__list_all")?e.classList.add("favourite"):(e.classList.remove("favourite"),a&&(n.removeChild(a),r=r.filter(s=>s._id!==t._id))),localStorage.setItem("favourites",JSON.stringify(r))}function h(e){const t=f(e),a=t.querySelector(".js__card__name"),s=document.createTextNode("😻");a.appendChild(s);const c=t.querySelector(".js__card__close"),m=document.createTextNode("❌");c.appendChild(m),c.classList.add("clickable"),c.addEventListener("click",S),n.appendChild(t),r.push(e)}
//# sourceMappingURL=main.js.map
