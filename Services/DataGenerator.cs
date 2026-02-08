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
            // 1. MAD Operation
            long combinedSeed = (userSeed * 6364136223846793005L) + pageIndex;

            // 2. Initialize the Faker with the specific locale
            // If the locale (like 'uk') fails, Bogus defaults to 'en'
            var faker = new Faker<Song>(locale);

            // 3. APPLY THE SEED
            // We cast the 64-bit seed to 32-bit int for the RNG
            faker.UseSeed((int)(combinedSeed % int.MaxValue));

            // 4. DEFINE RULES (Fixed syntax for standard Bogus)
            faker.RuleFor(s => s.Index, f => (pageIndex * 10) + f.IndexFaker + 1)
                 .RuleFor(s => s.Title, f => f.Commerce.ProductName())
                 .RuleFor(s => s.Artist, f => f.Name.FullName()) // Standard Name dataset
                 .RuleFor(s => s.Album, f => f.Commerce.Color() + " Album")
                 .RuleFor(s => s.Genre, f => f.Music.Genre()); // Standard Music dataset

            // 5. GENERATE & CONVERT
            var songs = faker.Generate(10).ToList();

            // 6. PROBABILISTIC LIKES
            var likeRandom = new Random((int)((userSeed + pageIndex) % int.MaxValue));
            foreach (var song in songs)
            {
                int floorLikes = (int)Math.Floor(avgLikes);
                double remainder = avgLikes - floorLikes;
                song.Likes = floorLikes + (likeRandom.NextDouble() < remainder ? 1 : 0);
            }

            return songs;
        }
    }
}