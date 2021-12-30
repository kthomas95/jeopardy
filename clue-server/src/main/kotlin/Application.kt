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
    install(ContentNegotiation) {
        json()
    }
    routing {
        get("/") {
            call.respond(seasons.getRandomCategory())
        }
    }
}