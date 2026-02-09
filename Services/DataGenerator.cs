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
            // 1. Setup Region (e.g., 'en-US' becomes 'en')
            string cleanedLocale = locale.Contains("-") ? locale.Split('-')[0] : locale;
            var faker = new Faker<Song>(cleanedLocale);

            // 2. Setup Deterministic Seed
            // We use the userSeed + pageIndex so every page is predictable.
            // Note: We DO NOT add avgLikes to the seed here. 
            // This ensures Song #1 stays "Song #1" even if you change likes (Stable Identity).
            long pageSeed = (userSeed * 6364136223846793005L) + pageIndex;
            faker.UseSeed((int)(pageSeed % int.MaxValue));

            // 3. Define Fake Data Rules
            faker.RuleFor(s => s.Index, f => (pageIndex * 10) + f.IndexFaker + 1)
                 .RuleFor(s => s.Title, f => f.Commerce.ProductName())
                 .RuleFor(s => s.Artist, f => f.Name.FullName())
                 .RuleFor(s => s.Album, f => f.Commerce.Color() + " Collection")
                 .RuleFor(s => s.Genre, f => f.Music.Genre())
                 .RuleFor(s => s.Lyrics, f => $"{f.Hacker.Phrase()}\n{f.Company.CatchPhrase()}\n{f.Hacker.Phrase()}");

            var songs = faker.Generate(10).ToList();

            // 4. Handle Likes and Audio (Deterministic)
            var itemRandom = new Random((int)(pageSeed % int.MaxValue));

            foreach (var song in songs)
            {
                // A. Probabilistic Likes
                // e.g. 3.7 likes -> 3 base likes + 70% chance of +1
                int floorLikes = (int)Math.Floor(avgLikes);
                double remainder = avgLikes - floorLikes;
                bool extraLike = itemRandom.NextDouble() < remainder;
                song.Likes = floorLikes + (extraLike ? 1 : 0);

                // B. Deterministic Audio
                // Same seed always picks the same track number (1-10)
                int trackNum = itemRandom.Next(1, 4); // Using 4 sample tracks for reliability
                song.AudioUrl = $"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{trackNum}.mp3";
            }

            return songs;
        }
    }
}