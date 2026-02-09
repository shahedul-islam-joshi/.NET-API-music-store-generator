using Bogus;
using MusicStoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MusicStoreApp.Services
{
    public class DataGenerator
    {
        public List<Song> GenerateSongs(string locale, long userSeed, int pageIndex, double avgLikes)
        {
            // Clean locale for Bogus (e.g., uk-UA -> uk)
            string cleanedLocale = locale.Contains("-") ? locale.Split('-')[0] : locale;

            var faker = new Faker<Song>(cleanedLocale);

            // Unique seed per page based on user seed
            long pageSeed = (userSeed * 6364136223846793005L) + pageIndex;
            faker.UseSeed((int)(pageSeed % int.MaxValue));

            faker.RuleFor(s => s.Index, f => (pageIndex * 10) + f.IndexFaker + 1)
                 .RuleFor(s => s.Title, f => f.Music.Genre() + " " + f.Commerce.ProductName())
                 .RuleFor(s => s.Artist, f => f.Name.FullName())
                 .RuleFor(s => s.Album, f => f.Commerce.Color() + " Collection")
                 .RuleFor(s => s.Genre, f => f.Music.Genre())
                 .RuleFor(s => s.Lyrics, f => $"{f.Hacker.Phrase()}\n{f.Company.CatchPhrase()}");

            var songs = faker.Generate(10).ToList();

            // Use the same page seed for reproducible likes and audio
            var itemRandom = new Random((int)(pageSeed % int.MaxValue));

            foreach (var song in songs)
            {
                // Probabilistic Likes Logic
                int floorLikes = (int)Math.Floor(avgLikes);
                double remainder = avgLikes - floorLikes;
                song.Likes = floorLikes + (itemRandom.NextDouble() < remainder ? 1 : 0);

                // Deterministic Audio: Same seed always picks same track
                int trackNum = (itemRandom.Next(1, 10));
                song.AudioUrl = $"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{trackNum}.mp3";
            }

            return songs;
        }
    }
}