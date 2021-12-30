import io.ktor.application.*
import io.ktor.features.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.serialization.*
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.io.File
import kotlin.random.Random.Default.nextInt




fun main(args: Array<String>) {

    embeddedServer(Netty, port = 8080) {
    }.start(wait = true)
}