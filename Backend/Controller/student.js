import {Student} from "../Models/Student.js"
import {Classroom} from "../Models/Classroom.js"
import { Homework } from "../Models/Homework.js";

//add Student
export const addStudent = async(req, res) => {
    let student = await Student.find({email : req.body.email});

    if(student.length > 0) {
        res.status(403).json({"message":"Student already exists"});
        return;
    }
    
    student = new Student(req.body);

    student.save().then(()=>{
        console.log("New Student Added Successfully");
        res.status(200).json({ message: "New Student Added Successfully" });
    }).catch((err)=>{
        console.log(err);
        res.send("Error Occurred !!! , Couldn't Add new Student");
    });
}

//get Student
export const getStudent = async(req,res)=>{
    const id = req.params.id;
    try {
        const student = await Student.findById(id);
        if(student == null) {
            res.status(400).json({message:"student does not exist"});
        }
        else {
            res.status(201).json({message:"success", student});
        }
    } catch (err) {
        //handle error
        console.log(err);
        res.status(500).json({message:"internal server error"});
    }
}

//get all students
export const getAllStuents = async(req,res)=>{
    try {
        const students = await Student.find({});
        res.status(201).json({message:"success", students})
    } catch (err) {
        //handle error
        console.log(err)
        res.status(500).json({message:"internal server error"})
    }
}

// delete student
export const deleteStudent = async(req,res)=>{
    const id=req.params.id;
    try {
        const deleteStudent = await Student.findByIdAndDelete(id);
        //respond with success message
        res.status(201).json({message:"success", deleteStudent})
    } catch (err) {
        //handle error
        console.log(err);
        res.status(500).json({message:"internal server error"});
    }
}

//mark attendance as preset
export const markPresent = async(req, res) => {
    const id = req.params.id;
    const date = new Date().toISOString().split('T')[0];
    const student = await Student.findById(id);

    if(student == null) {
        res.status(404).json({message : "Student does not exist"});
        return;
    }
    const index = student.absentDays.indexOf(date);
    if(index > -1) {
        student.absentDays.splice(index, 1);
    }

    if(!student.presentDays.includes(date)) {
        student.presentDays.push(date);
    }

    student.save().then(()=>{
        res.status(200).json({ message: "Student marked present Successfully" });
    }).catch((err)=>{
        console.log(err);
        res.send("Error Occurred !!!");
    });
}

//mark attendance as absent
export const markAbsent = async(req, res) => {
    const id = req.params.id;
    const date = new Date().toISOString().split('T')[0];
    const student = await Student.findById(id);

    if(student == null) {
        res.status(404).json({message : "Student does not exist"});
        return;
    }
    const index = student.presentDays.indexOf(date);
    if(index > -1) {
        student.presentDays.splice(index, 1);
    }

    if(!student.absentDays.includes(date)) {
        student.absentDays.push(date);
    }

    student.save().then(()=>{
        res.status(200).json({ message: "Student marked absent Successfully" });
    }).catch((err)=>{
        console.log(err);
        res.send("Error Occurred !!!");
    });
}

// get pending homework of student
export const getPendingHomeworkOfStudent = async(req, res) => {
    const id = req.params.id;
    const student = await Student.findById(id);

    if(!student) {
        res.status(404).json({message : "Student does not exist"});
        return;
    }

    if(student.classroom == null) {
        res.status(200).json({homeworks : []});
        return;
    }

    const classroom = await Classroom.findById(student.classroom);

    if(!classroom) {
        res.status(200).json({homeworks : []});
        return;
    }

    const homeworks = [];

    await Promise.all(classroom.homeworks.map(async(homeworkId) => {
        if(!student.submittedHomeworks.includes(homeworkId)) {
            let homework = await Homework.findById(homeworkId);
            homeworks.push(homework);
        }
    }));

    res.status(200).json({homeworks});
}