type ApiOptions = {
    method: ApiMethod;
    callback?: Function;
    params?: Record<string, any>;
    host?: string;
    cors?: boolean;
}
type ApiMethod = 'GET' | 'POST';
class Api {    
    //public static apiUrl = 'https://iv-scrum-api.herokuapp.com';    
    //public static apiUrl = 'http://10.0.2.2:5000';
    public static apiUrl = 'https://localhost:5001'
    public static call = async (route: string, options: ApiOptions) => {
        let url = `${options.host ?? this.apiUrl}${route}`;
        const headers = new Headers();   
        if (('cors' in options && options.cors) || !('cors' in options)){
            headers.append('mode', 'cors');
        }             
        // console.log(options.params)
        let body = new FormData();        
        const fetchOptions: RequestInit = {headers: headers, method: options.method};
        headers.append('Accept', 'application/json');
        if (options.method === 'POST'){            
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