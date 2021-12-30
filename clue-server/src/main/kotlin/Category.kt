import kotlinx.serialization.Serializable

@Serializable class Category(val title: String, val hint: String? = null, val clues: List<Clue>)