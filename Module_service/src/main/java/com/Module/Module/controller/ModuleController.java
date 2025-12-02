package com.Module.Module.controller;

import com.Module.Module.model.Module;
import com.Module.Module.service.ModuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")   // ❗ Removed @CrossOrigin to avoid conflicts
public class ModuleController {

private final ModuleService moduleService;

public ModuleController(ModuleService moduleService) {
    this.moduleService = moduleService;
}

@PostMapping
public ResponseEntity<Module> createModule(@RequestBody Module module) {
    return ResponseEntity.status(201).body(moduleService.saveModule(module));
}

@GetMapping
public ResponseEntity<List<Module>> getAllModules() {
    return ResponseEntity.ok(moduleService.getAllModules());
}

@GetMapping("/{id}")
public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
    return moduleService.getModuleById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

@PutMapping("/{id}")
public ResponseEntity<Module> updateModule(@PathVariable Long id, @RequestBody Module moduleDetails) {
    try {
        return ResponseEntity.ok(moduleService.updateModule(id, moduleDetails));
    } catch (RuntimeException e) {
        return ResponseEntity.notFound().build();
    }
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
    moduleService.deleteModule(id);
    return ResponseEntity.noContent().build();
}

@GetMapping("/code/{code}")
public ResponseEntity<Module> getModuleByCode(@PathVariable String code) {
    return moduleService.getModuleByCode(code)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

}
