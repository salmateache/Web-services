package com.Module.Module;

import com.Module.Module.model.Module;
import com.Module.Module.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ModuleApplication implements CommandLineRunner {

    @Autowired
    private ModuleService moduleService;

    public static void main(String[] args) {
        SpringApplication.run(ModuleApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Starting Database Test ---");

        // ✅ Updated constructor call to use camelCase parameters
        Module newModule = new Module(
            "CS101",               // codeModule
            "Programmation Java",  // nomModule
            3,                     // coefficient
            1,                     // semestre
            null                   // idProf (since you don't have Professors service yet)
        );
        moduleService.saveModule(newModule);
        
        System.out.println("✅ Module saved: " + newModule.getNomModule());
        System.out.println("--- Database Test Complete ---");
    }
}