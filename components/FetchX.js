import React, { Component } from "react";
const API_KEY = 'YOUR_API_KEY'
const API = 'https://pixabay.com/api'
class FetchX extends Component{
  async get(category,page=1,per_page=10,image_type='all',orientation='all',editors_choice='true',safeSearch=true,order='popular'){
      category = category.toLowerCase()
      let query = API+'/?key='+API_KEY+'&category='+category+'&orientation=vertical&safesearch='+safeSearch+'&per_page='+per_page+'&editors_choice='+editors_choice+'&page='+page
      const response = await fetch(query);
      if(response.ok){
        const data = await response.json();
        return data
      }else{
        return false
      }
  }
//search(search,page=1,per_page=20,safeSearch=true,image_type='all',orientation='all',colors="all",editors_choice='true',order='popular')
  async search(search,page=1,filters){
      search = search.toLowerCase()
      let query = API+'/?key='+API_KEY+'&q='+search+'&orientation='+filters.orientation+'&safesearch='+filters.safesearch+'&per_page='+filters.per_page+'&editors_choice='+filters.editors_choice+'&page='+page
      const response = await fetch(query)
      if(response.ok){
        const data = await response.json();
        return data
      }else{
        return false
      }
  }
  async getSingle(id){
      let query = API+'/?key='+API_KEY+'&id='+id
      const response = await fetch(query)
      if(response.ok){
          const data = await response.json();
          return data

      }else{
          
          return false
      }
  }
}

export default FetchX;
