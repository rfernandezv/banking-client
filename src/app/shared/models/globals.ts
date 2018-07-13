import { Injectable } from "@angular/core";
import { Customer} from '../../models/customer';


@Injectable()
export class Globals {
    customer : Customer;
}