export interface IIamToken {
    sub: string,
    aud: string,
    uid: string,
    eid?: string,
    zid: string,
    language?:string,
    locale?:string
}
