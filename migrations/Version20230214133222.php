<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230214133222 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE cookies (id INT AUTO_INCREMENT NOT NULL, text LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE politique_confidentialite (id INT AUTO_INCREMENT NOT NULL, text LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('DROP TABLE admin');
        $this->addSql('ALTER TABLE client DROP description, DROP departement, DROP parrain, DROP roles, DROP google_id, DROP category, DROP ville, DROP code');
        $this->addSql('ALTER TABLE user DROP firstname, DROP lastname, DROP token');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('DROP TABLE cookies');
        $this->addSql('DROP TABLE politique_confidentialite');
        $this->addSql('ALTER TABLE client ADD description LONGTEXT DEFAULT NULL, ADD departement LONGTEXT DEFAULT NULL, ADD parrain LONGTEXT DEFAULT NULL, ADD roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', ADD google_id NUMERIC(60, 0) DEFAULT NULL, ADD category LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:array)\', ADD ville VARCHAR(255) NOT NULL, ADD code VARCHAR(6) NOT NULL');
        $this->addSql('ALTER TABLE user ADD firstname VARCHAR(180) NOT NULL, ADD lastname VARCHAR(180) NOT NULL, ADD token VARCHAR(255) DEFAULT NULL');
    }
}
