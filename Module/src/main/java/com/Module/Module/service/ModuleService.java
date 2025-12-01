package com.Module.Module.service;

import com.Module.Module.model.Module;
import com.Module.Module.repository.ModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    @Transactional
    public Module saveModule(Module module) {
        return moduleRepository.save(module);
    }

    @Transactional(readOnly = true)
    public Optional<Module> getModuleById(Long id) {
        return moduleRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    // ✅ ADDED: Update method that was missing
    @Transactional
    public Module updateModule(Long id, Module moduleDetails) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with id: " + id));
        
        module.setNomModule(moduleDetails.getNomModule());
        module.setCodeModule(moduleDetails.getCodeModule());
        module.setCoefficient(moduleDetails.getCoefficient());
        module.setSemestre(moduleDetails.getSemestre());
        
        return moduleRepository.save(module);
    }

    @Transactional
    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }
    
    // ✅ ADDED: Find by code method
    @Transactional(readOnly = true)
    public Optional<Module> getModuleByCode(String codeModule) {
        return moduleRepository.findByCodeModule(codeModule);
    }
}