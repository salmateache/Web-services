package com.Module.Module.repository;

import com.Module.Module.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository  // ✅ Added @Repository annotation
public interface ModuleRepository extends JpaRepository<Module, Long> {

    // ✅ NOW THIS WORKS - because property is camelCase
    Optional<Module> findByCodeModule(String codeModule);

    // Alternative with @Query
    @Query("SELECT m FROM Module m WHERE m.codeModule = :code")
    Optional<Module> findByCode(@Param("code") String code);
    
    // Check if exists
    boolean existsByCodeModule(String codeModule);
}