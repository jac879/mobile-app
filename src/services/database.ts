import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AuthService } from "./auth";

import 'rxjs/Rx';

@Injectable()

export class DatabaseService {

	constructor(private http: Http, private authService: AuthService) {}

	putData(token: string)
	{

		const userId = this.authService.getActiveUser().uid;

		var test = {
						hello : "asdasdf",
						there : "qwerqwer"
					}
		//put overrides
		//post merges
		return this.http.put('https://weathersight-76387.firebaseio.com/' + userId + '/test.json?auth=' + token, test)
		.map((response : Response) => {
			return response.json();
		});
	}

}