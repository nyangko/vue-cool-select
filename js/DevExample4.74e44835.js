(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["DevExample4"],{"0d59":function(e,t,s){"use strict";s.r(t);var l=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"demo-page-wrap"},[s("div",[s("h1",{staticStyle:{"text-align":"center"}},[e._v("Usage Example 4")]),s("b",[e._v("Selected:")]),e._v(" "+e._s(e.selected||"not chosen")+".\n    "),s("br"),s("br"),s("button",{on:{click:function(t){e.search=""}}},[e._v("\n      Set search\n    ")]),e._v('\n\n    Search: "'+e._s(e.search)+'"\n\n    '),s("cool-select",{ref:"select",attrs:{items:e.items,"search-text":e.search,"input-styles":{border:"1px solid red",backgroundColor:"yellow"},"arrows-disable-instant-selection":"",placeholder:"Select name"},on:{"update:searchText":function(t){e.search=t},"update:search-text":function(t){e.search=t},select:e.onSelect,focus:e.onFocus,blur:e.onBlur,"change-displayed-items":e.onChangeDisplayedItems},model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}},[e.displayedItems.length?s("div",{staticStyle:{background:"red"},attrs:{slot:"before-items-fixed"},slot:"before-items-fixed"},[e._v("\n        before-items-fixed\n      ")]):e._e(),e.displayedItems.length?s("div",{staticStyle:{background:"red"},attrs:{slot:"before-items"},slot:"before-items"},[e._v("\n        before-items\n      ")]):e._e(),e.displayedItems.length?s("div",{staticStyle:{background:"blue"},attrs:{slot:"after-items"},slot:"after-items"},[e._v("\n        after-items\n      ")]):e._e(),e.displayedItems.length?s("div",{staticStyle:{background:"blue"},attrs:{slot:"after-items-fixed"},slot:"after-items-fixed"},[e._v("\n        after-items-fixed\n      ")]):e._e()])],1)])},o=[],n=s("1d50"),a={components:{CoolSelect:n["CoolSelect"]},data(){const e=[];for(let t=1;t<=42;t++)e.push("Item "+t);return{search:"",selected:e[1],items:e,displayedItems:e}},methods:{onChangeDisplayedItems(e){this.displayedItems=e},onSelect(e){console.log("onSelect",e,this.selected)},onBlur(){console.log("blur")},onFocus(){console.log("focus")}}},c=a,i=s("a6c2"),r=Object(i["a"])(c,l,o,!1,null,null,null);t["default"]=r.exports}}]);
//# sourceMappingURL=DevExample4.74e44835.js.map