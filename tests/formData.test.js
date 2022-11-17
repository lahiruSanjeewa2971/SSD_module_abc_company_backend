const formDataCtrl = require("../controllers/FormDataCtrl");
require("dotenv").config();
const mongoose = require("mongoose");
describe("Should form data added", () => {
  it("Add Form Data", function(){
        async() => {
            const message = {
                message:"quatation 12345 added",
                image:""
            }
            const newMessage =  await formDataCtrl.createFormDataByUser(message);
            expect(newMessage.userName).toEqual("quatation 12345 added");
            expect(newMessage.password).toEqual("");
        }
    } );
    
})