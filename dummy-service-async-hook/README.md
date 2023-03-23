# Project Documentation/Wiki

Simple service to demonstrate use if thread local storage

# Set up
use node: ">=14.20.0 <15.0.0"

cd projects/dummy-service-async-hook
npm i
npm run build
npm run start

# Endpoint

GET : http://localhost:8080/user-service/case1
This uses simple variables to pass session data around, works fine but can be tedious to pass session data in all the classes

GET : http://localhost:8080/user-service/case2
This uses static objects to pass session data around, this might work for a single or few calss in parallel from postman etc. However with significant number of
parallel calls session context information will be lost. Example follow the section of bulk calls below.

GET : http://localhost:8080/user-service/case3
This uses thread local storage, you do not need to pass information around. You can do a get / set of context however it works only with a callback function which will have
the access to the thread local context. Please see the implemetation in  /src/http/routes/userRoute.ts

Response :
```
{
    "value": {
        "testheader": "123",
        "data": [
            {
                "user": {
                    "id": "emp1",
                    "points": 56000,
                    "married": true
                }
            },
            {
                "user": {
                    "id": "emp2",
                    "points": 56000,
                    "married": true
                }
            },
            {
                "user": {
                    "id": "emp3",
                    "points": 56000,
                    "married": true
                }
            }
        ]
    }
}
```

# Bulk testing with parralel calls

Use case :
1. Client will generate a random number and pass to server in request header variable testheader
2. Server will collect this information and pass it around in 3 differnt ways to process the request
3. Response should have the same value for testheader passed from client

Go to examples/dummy-service-async-hook/_testing-programs and run the programs.

case 1 : ts-node test-case1.ts ( Working case )
Note : Here req and res has same testheader hence not equal is not printed in console.

Case 2 : ts-node test-case2.ts ( Non Working case )
Note : Here req and res does not have same testheader hence not equal is printed in console !

Case 3 : ts-node test-case3.ts ( Working case )
Note : Here req and res has same testheader hence not equal is not printed in console.

Case 4 and 5 : to test node block cases from async and callbacks
