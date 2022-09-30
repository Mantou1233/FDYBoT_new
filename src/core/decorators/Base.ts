

function Inject(target: any, propKey: string | symbol){
	switch(propKey){
		case "client": {
			target.client = 0;//client
		}
	}
}



