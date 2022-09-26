type ApiOptions = {
    method: ApiMethod;
    callback?: Function;
    params?: Record<string, any>;
}
type ApiMethod = 'GET' | 'POST';
class Api {    
    public static apiUrl = 'https://iv-scrum-api.herokuapp.com';    
    //public static apiUrl = 'http://10.0.2.2:5000';
    public static call = async (route: string, options: ApiOptions) => {
        let url = `${this.apiUrl}${route}`;
        const headers = new Headers();        
        headers.append('mode', 'cors');
        // console.log(options.params)
        let body = new FormData();        
        const fetchOptions: RequestInit = {headers: headers, method: options.method};
        if (options.method === 'POST'){
            headers.append('Accept', 'application/json');
            // headers.append('Content-Type', 'multipart/form-data');            
            Object.keys(options.params as Record<string, any>).forEach(key => {
                body.append(key, (<Record<string, any>>options.params)[key])
            })
            fetchOptions.body = body;
        }
        else if (options.params){
            Object.keys(options.params).forEach(k => {
                const value = (options?.params as Record<string, any>)[k];
                url += `/${value}`;
            })
        }
        // console.log(`Fetching ${url}`);
        const res = await fetch(url, fetchOptions)
            .catch(e => {            
                console.error(e);
            });                   
        if (typeof options.callback === 'function'){            
            try{                            
                (res as Response)?.json()
                .then(data => {                
                    if (options.callback){
                        options.callback(data);
                    }
                })
                .catch((e) => {
                    console.error(e);
                    if (options.callback){
                        options.callback();
                    }                    
                });
            }
            catch(e){
                console.error(e);
            }
        }
    }
}
export default Api;
export type { ApiOptions };