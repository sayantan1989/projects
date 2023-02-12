export class Session {
    private static session:any;
    static setSession(session:any){
        this.session = session;
    }
    static getSession(){
        return this.session ;
    }
}