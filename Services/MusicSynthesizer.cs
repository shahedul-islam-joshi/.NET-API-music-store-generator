namespace MusicStoreApp.Services
{
    public class MusicSynthesizer
    {
        public string GenerateAudioUrl(string genre, int seed)
        {
            // Using a procedural audio service (like a placeholder synth engine)
            // The 'seed' ensures the same music plays for the same song every time.
            string instrument = (seed % 3 == 0) ? "piano" : (seed % 3 == 1) ? "guitar" : "synth";

            // This returns a URL to a procedural audio generator or a specific seeded track
            return $"https://your-audio-engine.com/play?genre={genre}&seed={seed}&instrument={instrument}";
        }
    }
}