import { HttpHeaders} from '@angular/common/http';


export const HttpOptionsConst = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
      
    })
  };
