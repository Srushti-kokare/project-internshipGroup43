const collegeModel=require("../models/collegeModel") 

const internModel=require("../models/internModel") 

const isValidRequestBody = (requestBody) => {

    return Object.entries(requestBody).length > 0 //Object.entries() returns an array whose elements are arrays
                                                 // corresponding to the enumerable string-keyed property [key, value] pairs
                                                 // found directly upon object. 
  
  }
  const isValid = (value) => {

    if (typeof value === 'undefined' || value === null) return false
  
    if (typeof value === 'string' && value.trim().length === 0) {
  
      return false
    }
    return true
  }

const createCollege= async function(req,res){
    try{
        let requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
          return res.status(400).send({ status: false, msg: "invalid request parameters . Please Provide college Details" })
        }    
     const { name, fullName, logoLink} = requestBody;

        if (!isValid(name)) { //type of name 
            res.status(400).send({ Status: false, message: "College Name is required" })
            return
          }
        if (!isValid(fullName)) {
          res.status(400).send({ Status: false, message: "full name is required" })
          return
        }
        const upperCaseFullName=requestBody.fullName

        let newStringFullName=convertFirstLetterToUpperCase(upperCaseFullName)
        function convertFirstLetterToUpperCase(upperCaseFullName) {
          var  splitStr= upperCaseFullName.toLowerCase().split(' ');
          for (var i = 0; i < splitStr.length; i++) {
              splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);    
          }
         
          return splitStr.join(' ');
        }
        if (!isValid(logoLink)) {
            res.status(400).send({ Status: false, message: "logo link is required" })
            return
          }
    
        const newCollege = await collegeModel.create(requestBody);
        const savedData= {name:newCollege.name,fullName:newStringFullName, logoLink:newCollege.logoLink}
        res.status(201).send({ status: true,  data: savedData }) //201 successfuly connected 200 ok
      } catch (err) {
        res.status(500).send( { Status: false, message: err.message } )
      }
    
    }

    const getCollege = async function (req, res) {
      try {
        let interns = []
        let result = {}
        let collegeName = req.query.name
    
        if (!collegeName)
          return res.status(400).send({ status: false, msg: "invalid request parameters . Please Provide college name" })
    
    
        let collegeDetails = await collegeModel.findOne({ name: collegeName })
        if (!collegeDetails)
          res.status(400).send({ status: false, msg: "No College Found" })
    
        let internDetails = await internModel.find({ collegeId: collegeDetails._id })
        if (internDetails.length === 0) {
          res.status(400).send({ status: false, msg: "No interns were Found" })
        }
        let collegeData = {
          name: collegeDetails.name,
          fullName: collegeDetails.fullName,
          logoLink: collegeDetails.logoLink
        }
        for (let i = 0; i < internDetails.length; i++) {
          result = {
            _id:internDetails[i]._id,
            name: internDetails[i].name,
            email: internDetails[i].email,
            mobile: internDetails[i].mobile
          }
          interns.push(result)
        }
        collegeData["intrests"] = interns
        //console.log(collegeData)
        res.status(200).send({ status: true, data: collegeData })
      }
      catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
      }
    }
   module.exports.getCollege=getCollege
module.exports.createCollege=createCollege
