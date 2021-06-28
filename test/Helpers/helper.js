const chai=require('chai');
const {generateOTP,sendOTP}=require('../../Helpers/helpers.js');
const assert=chai.assert;


describe("Testing for helper Functions",function(){

    it("Testing OTP Generating function",()=>{
        let OTP=generateOTP();
        let len=OTP.length
        assert.lengthOf(OTP,6,`OTP has length ${len} instead of 6`);
    });
    it("Testing Sending OTP function.It will add email job to Job queue",()=>{

        let result=sendOTP("xyxabcdfg","gauravponkiya1508@gmail.com");
        assert.equal(result,true,`It should be true`);
    })

})