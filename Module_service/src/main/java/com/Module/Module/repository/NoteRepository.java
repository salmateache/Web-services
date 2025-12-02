package com.Module.Module.repository;

import com.Module.Module.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByIdEtudiant(Long idEtudiant);

    List<Note> findByIdModule(Long idModule);
}
