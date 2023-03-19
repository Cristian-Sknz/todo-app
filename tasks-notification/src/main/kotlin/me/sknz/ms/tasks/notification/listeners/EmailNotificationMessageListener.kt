package me.sknz.ms.tasks.notification.listeners

import me.sknz.ms.tasks.notification.entity.TaskNotification.NotificationType
import me.sknz.ms.tasks.notification.model.ScheduledNotification
import me.sknz.ms.tasks.notification.repository.TaskNotificationRepository
import me.sknz.ms.tasks.notification.repository.TaskRepository
import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger
import org.springframework.amqp.core.Message
import org.springframework.data.repository.findByIdOrNull
import org.springframework.mail.MailException
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Component

/**
 * ## EmailNotificationMessageListener
 *
 * Classe responsável por receber mensagens da fila do RabbitMQ
 * e enviar notificações por Email.
 */
@Component
class EmailNotificationMessageListener(
    private val notifications: TaskNotificationRepository,
    private val tasks: TaskRepository,
    private val javamail: JavaMailSender
) : JsonMessageListener() {

    val logger: Logger = LogManager.getLogger(this::class.java)

    /**
     * Esta função ira receber uma notificação agendada [ScheduledNotification],
     * verificar se o usuário que enviou possui um email e enviar uma mensagem informando o
     * término de uma tarefa.
     */
    override fun onMessage(message: Message) {
        if (message.messageProperties.headers.containsKey("x-cancel-scheduled-message")) {
            return
        }

        val scheduled = message.parse<ScheduledNotification>()
        val task = tasks.findByIdOrNull(scheduled.taskId) ?: return

        if (task.author.email.isNullOrEmpty()) {
            notifications.createSentNotification(task, NotificationType.FINISHED)
            return
        }

        try {
            javamail.send(SimpleMailMessage().apply {
                setTo(task.author.email)
                subject = "To-do: ${task.name}"
                text = "Sua tarefa ${task.name} (${task.description ?: "Sem descrição"}) foi finalizada!"
            })

            logger.debug("Notificado o usuário ${task.author.username} com o email ${task.author.email}")
        } catch (e: MailException) {
            logger.error("Ocorreu um erro ao tentar enviar um email", e)
        } finally {
            notifications.createSentNotification(task, NotificationType.FINISHED)
        }
    }
}