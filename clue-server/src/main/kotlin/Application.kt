import io.ktor.application.*
import io.ktor.features.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.serialization.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module(testing: Boolean = false) {
    val seasons = loadSeasons()
    seasons.forEach {
        println("${it.key}: ${it.value.categories.size}")
    }
    install(CORS) {
        anyHost()
    }
    install(ContentNegotiation) {
        json()
    }
    routing {
        get("/{amount}") {
            val amount = call.parameters["amount"]?.toInt() ?: 1
            val response = List(amount.coerceAtMost(6)) { seasons.getRandomCategory() }
            call.respond(response)
        }
    }
}