namespace MusicStoreApp.Models
{
    public class Song
    {
        public int Index { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public string Album { get; set; }
        public string Genre { get; set; }
        public string Lyrics { get; set; }
        public int Likes { get; set; }
    }
}
