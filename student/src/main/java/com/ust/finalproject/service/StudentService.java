package com.ust.finalproject.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ust.finalproject.model.Student;
import com.ust.finalproject.repository.StudentRepository;
@Service
public class StudentService 
{
	@Autowired
	private StudentRepository repo;
    @Autowired
    private JwtService jwtService;
	public Student findById(int StudentId) 
	{
        return repo.findById(StudentId).orElse(null);
    }
	public Optional<Student> findByStudentName(String StudentName)
	{
		return repo.findByStudentName(StudentName);
	}
	public Student addStudent(Student student)
	{
		return repo.save(student);
	}
	public List<Student> findAll() 
	{
        return repo.findAll();
    }
    public String generateToken(String username) {
        return jwtService.generateToken(username);
    }
}