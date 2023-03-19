package me.sknz.ms.tasks.validation

import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = [EndsDateLimitValidator::class])
annotation class EndsDateLimit(
    val message: String = "A data de termino deve ser no maximo 2 semanas da data atual.",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)