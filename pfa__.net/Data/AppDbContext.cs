using Microsoft.EntityFrameworkCore;
using pfa__.net.Models;

namespace pfa__.net.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets de ta copine
        public DbSet<Piece> Pieces { get; set; }
        public DbSet<PieceType> PieceTypes { get; set; }
        public DbSet<Equipement> Equipements { get; set; }
        public DbSet<EquipementType> EquipementTypes { get; set; }

        // DbSets de toi
        public DbSet<Regle> Regles { get; set; }
        public DbSet<ConditionHistorique> ConditionHistoriques { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- PieceType ---
            modelBuilder.Entity<PieceType>()
                .HasKey(pt => pt.id_type);

            // --- EquipementType ---
            modelBuilder.Entity<EquipementType>()
                .HasKey(et => et.id_type);

            // --- Piece -> PieceType ---
            modelBuilder.Entity<Piece>()
                .HasOne(p => p.PieceType)
                .WithMany(t => t.Pieces)
                .HasForeignKey(p => p.type_id)
                .HasPrincipalKey(pt => pt.id_type)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Equipement -> EquipementType ---
            modelBuilder.Entity<Equipement>()
                .HasOne(e => e.EquipementType)
                .WithMany()
                .HasForeignKey(e => e.type_id)
                .HasPrincipalKey(et => et.id_type)
                .OnDelete(DeleteBehavior.Restrict);

            // --- Piece -> Equipements ---
            modelBuilder.Entity<Piece>()
                .HasMany(p => p.Equipements)
                .WithOne(e => e.Piece)
                .HasForeignKey(e => e.Id_Piece)
                .OnDelete(DeleteBehavior.Cascade);

            // --- Regle ---
            modelBuilder.Entity<Regle>(entity =>
            {
                entity.ToTable("regle");
                entity.HasKey(r => r.IdRegle);
                entity.Property(r => r.IdRegle).HasColumnName("id_regle");
                entity.Property(r => r.DateRegle).HasColumnName("dateRegle");
                entity.Property(r => r.ChaqueJour).HasColumnName("chaque_jour");
                entity.Property(r => r.IdEquipement).HasColumnName("id_equipement");

                entity.Property(r => r.HeureDebut)
                      .HasColumnName("heureDebut")
                      .HasColumnType("varchar(10)");

                entity.Property(r => r.HeureFin)
                      .HasColumnName("heureFin")
                      .HasColumnType("varchar(10)");

                entity.HasOne(r => r.Equipement)
                      .WithMany(e => e.Regles)
                      .HasForeignKey(r => r.IdEquipement)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // --- ConditionHistorique ---
            modelBuilder.Entity<ConditionHistorique>(entity =>
            {
                entity.ToTable("condition_historique");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).HasColumnName("id");
                entity.Property(c => c.IdEquipement).HasColumnName("id_equipement");
                entity.Property(c => c.Valeur).HasColumnName("valeur");
                entity.Property(c => c.DateHeure).HasColumnName("date_heure");

                entity.HasOne(c => c.Equipement)
                      .WithMany(e => e.ConditionHistoriques)
                      .HasForeignKey(c => c.IdEquipement);
            });
        }
    }
}