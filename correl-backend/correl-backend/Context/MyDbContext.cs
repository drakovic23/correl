using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using correl_backend.Models;

namespace correl_backend.Context;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BondRate> BondRates { get; set; }

    public virtual DbSet<BondType> BondTypes { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<DescriptiveStat> DescriptiveStats { get; set; }

    public virtual DbSet<GeneralStat> GeneralStats { get; set; }

    public virtual DbSet<Histogram> Histograms { get; set; }

    public virtual DbSet<Indicator> Indicators { get; set; }

    public virtual DbSet<IndicatorValue> IndicatorValues { get; set; }

    public virtual DbSet<Ticker> Tickers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BondRate>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BOND_RAT__3214EC27BA2E35ED");

            entity.ToTable("BOND_RATES");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.BondYield).HasColumnType("decimal(4, 2)");

            entity.HasOne(d => d.Type).WithMany(p => p.BondRates)
                .HasForeignKey(d => d.TypeId)
                .HasConstraintName("FK__BOND_RATE__TypeI__71D1E811");
        });

        modelBuilder.Entity<BondType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BOND_TYP__3214EC272402032B");

            entity.ToTable("BOND_TYPES");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.BondName)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.CountryNavigation).WithMany(p => p.BondTypes)
                .HasForeignKey(d => d.Country)
                .HasConstraintName("FK__BOND_TYPE__Count__6EF57B66");
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__COUNTRIE__3214EC27BC2AA03E");

            entity.ToTable("COUNTRIES");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CountryCode)
                .HasMaxLength(8)
                .IsUnicode(false);
            entity.Property(e => e.CountryString)
                .HasMaxLength(64)
                .IsUnicode(false);
            entity.Property(e => e.Currency)
                .HasMaxLength(4)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DescriptiveStat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DESCRIPT__3214EC274F74E186");

            entity.ToTable("DESCRIPTIVE_STATS");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Max).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Mean).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Min).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Quartile1).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Quartile2).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Quartile3).HasColumnType("decimal(18, 4)");
            entity.Property(e => e.Std).HasColumnType("decimal(18, 4)");

            entity.HasOne(d => d.Ticker).WithMany(p => p.DescriptiveStats)
                .HasForeignKey(d => d.TickerId)
                .HasConstraintName("FK__DESCRIPTI__Ticke__07C12930");
        });

        modelBuilder.Entity<GeneralStat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__GENERAL___3214EC2773AA82A2");

            entity.ToTable("GENERAL_STATS");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RollingDuration)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.Value).HasColumnType("decimal(18, 3)");

            entity.HasOne(d => d.Indicator).WithMany(p => p.GeneralStats)
                .HasForeignKey(d => d.IndicatorId)
                .HasConstraintName("FK__GENERAL_S__Indic__123EB7A3");

            entity.HasOne(d => d.Ticker).WithMany(p => p.GeneralStats)
                .HasForeignKey(d => d.TickerId)
                .HasConstraintName("FK__GENERAL_S__Ticke__114A936A");
        });

        modelBuilder.Entity<Histogram>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HISTOGRA__3214EC27142F70CA");

            entity.ToTable("HISTOGRAM");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Bins).HasColumnType("decimal(8, 3)");

            entity.HasOne(d => d.Ticker).WithMany(p => p.Histograms)
                .HasForeignKey(d => d.TickerId)
                .HasConstraintName("FK__HISTOGRAM__Ticke__0A9D95DB");
        });

        modelBuilder.Entity<Indicator>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__INDICATO__3214EC27AD02BE21");

            entity.ToTable("INDICATORS");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.EventName)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.CountryNavigation).WithMany(p => p.Indicators)
                .HasForeignKey(d => d.Country)
                .HasConstraintName("FK__INDICATOR__Count__5EBF139D");
        });

        modelBuilder.Entity<IndicatorValue>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__INDICATO__3214EC278F8BE611");

            entity.ToTable("INDICATOR_VALUES");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Actual)
                .HasMaxLength(8)
                .IsUnicode(false);

            entity.HasOne(d => d.Indicator).WithMany(p => p.IndicatorValues)
                .HasForeignKey(d => d.IndicatorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__INDICATOR__Indic__619B8048");
        });

        modelBuilder.Entity<Ticker>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TICKERS__3214EC277655716E");

            entity.ToTable("TICKERS");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Ticker1)
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("Ticker");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
