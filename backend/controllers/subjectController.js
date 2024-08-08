const Subject = require("../models/subject");


exports.addSubject = async (req, res) => {
  try {
    const { name, courseId } = req.body;

    // Validate input
    if (!name || !courseId) {
      return res
        .status(400)
        .json({ message: "Name and courseId are required." });
    }

    // Create a new subject
    const newSubject = new Subject({ name, courseId });

    // Save the subject to the database
    await newSubject.save();

    // Send response
    res.status(201).json({
      message: "Subject added successfully",
      subject: newSubject,
    });
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Function to gett all the subject by courseId
exports.getAllSubjectsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Validate input
    if (!courseId) {
      return res
       .status(400)
       .json({ message: "courseId is required." });
    }

    // Find all subjects belonging to the given courseId
    const subjects = await Subject.find({ courseId });

    // Send response
    res.json({ subjects });
  } catch (error) {
    console.error("Error getting subjects by courseId:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Function to update subject 
exports.updateSubject = async(req, res) =>{
    try{
        const subjectId = req.params.subjectId;
        const {name} = req.body;

        //Validate input
        if(!subjectId ||!name){
            return res
           .status(400)
           .json({ message: "SubjectId and name are required." });
        }

        // const updateSubject = await Subject.find({subjectId: subjectId});

       
    }
    catch(error){
        console.error("Error updating subject:", error);
        res.status(500).json({ message: "Server error" });
    }
}
