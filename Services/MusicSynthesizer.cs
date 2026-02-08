namespace MusicStoreApp.Services
{
    public class MusicSynthesizer
    {
        // Generates a deterministic "Audio Fingerprint" based on song metadata
        public string GenerateAudioMetadata(string genre, string title, int seed)
        {
            // This simulates linking the fake data to a synthetic audio engine
            return $"SYNTH-{genre.ToUpper()}-{seed}-{title.GetHashCode():X}";
        }

        // Returns a placeholder duration or BPM for the song
        public int GetBpm(int seed)
        {
            var rng = new Random(seed);
            return rng.Next(60, 180); // Standard musical BPM range
        }
    }
}