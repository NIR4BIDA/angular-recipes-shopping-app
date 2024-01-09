import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { map } from "rxjs/operators"
@Injectable({
    providedIn: 'root',
  })
export class HttpService{
    constructor(private http:HttpClient){}
    postData(url,data){
        this.http.put(url,data).subscribe((data)=>{
            console.log(data)
        })
    }
    fetchData(url){
        return this.http.get(url).pipe(map(data=>{
            const array=[]
            for(const key in data){
                if(data.hasOwnProperty(key)){
                    array.push(data[key])
                }
            }
            return array
        }))
    }
}