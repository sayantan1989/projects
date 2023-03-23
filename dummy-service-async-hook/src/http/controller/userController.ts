import config from '../../../src/test.json';
import { Session } from '../../Session';
import { getSessionFromExecutionCtx } from '../../common/session';
import axios from 'axios';


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
      const session = getSessionFromExecutionCtx();
      const random = session.testheader;
      // introduce a random delay
      await new Promise(f => setTimeout(f, random));


      return {
          testheader: session.testheader,
          data: config
        };
  }

   // case 4 : testheader is taken from Session Class
   public async case4(testheader:any) {
    // this request takes testheader seconds to complete, does not block even if testheader is 10
    const url = `https://reqres.in/api/users?delay=${testheader}`;

    const { status, data } = await axios.get<any>(
      url,
      {
          headers: {
              Accept: 'application/json',
              testHeader: testheader
          },
      },
  );

    return {

        data: config
      };
}

// case 5 : testheader is taken from Session Class
public async case5(testheader:any) {
  // this request takes testheader seconds to complete, does not block even if testheader is 10
  const url = `https://reqres.in/api/users?delay=${testheader}`;


  const longFunction = async function () {
    const { status, data } = await axios.get<any>(
      url,
      {
          headers: {
              Accept: 'application/json',
              testHeader: testheader
          },
      },
  );
  }

  const callbackFunctionPromiseWithoutTimeout = async function (fn: () => void) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        console.log('Inside callbackFunctionPromiseWithoutTimeout: Before execution');
        await fn();
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        console.log('Inside callbackFunctionPromiseWithoutTimeout: After execution');
      }
    });
  }
  await callbackFunctionPromiseWithoutTimeout(longFunction)

  return {

      data: config
    };
}

}