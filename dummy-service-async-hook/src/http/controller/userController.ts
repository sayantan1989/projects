import config from '../../../src/test.json';
import { Session } from '../../Session';
import { getSessionFromExecutionCtx } from '../../common/session';

export class UserController {


    // case 1 : testheader is passed as param
    public async case1(testheader:any) {
        const random = Math.random()*1000;
        // introduce a random delay
        await new Promise(f => setTimeout(f, random));
          return {
            testheader: testheader,
            data: config
          };
    }

    // case 2 : testheader is taken from Session Class
    public async case2() {
        const random = Math.random()*1000;
        // introduce a random delay
        await new Promise(f => setTimeout(f, random));
        return {
            testheader: Session.getSession(),
            data: config
          };
    }


    // case 3 : testheader is taken from Session Class
    public async case3() {
      const random = Math.random()*1000;
      // introduce a random delay
      await new Promise(f => setTimeout(f, random));

      const session = getSessionFromExecutionCtx();
      return {
          testheader: session.testheader,
          data: config
        };
  }
}