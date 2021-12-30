import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.io.File
import kotlin.random.Random

@Serializable class Season(val name: String, val categories: List<Category>)


typealias ClueDB = Map<String, Season>
fun loadSeasons(): ClueDB {
    println("Loading clues...\n")
    val seasons = mutableMapOf<String, Season>()

    File("questions/").listFiles()?.forEach {
        val season = Season(name = it.nameWithoutExtension, categories = Json.decodeFromString(
            it.readText()
        ))
        seasons[it.nameWithoutExtension] = season
    }
    return seasons
}
fun ClueDB.getRandomSeason(): Season = this.entries.elementAt(Random.nextInt(this.entries.size)).value
fun ClueDB.getRandomCategory(): Category = this.getRandomSeason().run {
    this.categories[Random.nextInt(this.categories.size)]
}
