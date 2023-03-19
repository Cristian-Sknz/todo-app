package me.sknz.ms.tasks.repository;

import me.sknz.ms.tasks.entity.Task
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface TaskRepository : JpaRepository<Task, UUID> {

    @Query("select t from Task t where t.author.id = ?1")
    fun findByAuthorId(id: UUID): List<Task>

    @Query("select t from Task t where t.id = ?1 and t.author.id = ?2")
    fun findByIdAndAuthorId(id: UUID, authorId: UUID): Optional<Task>

}