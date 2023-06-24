<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221206104523 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE client (id INT AUTO_INCREMENT NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, gender VARCHAR(255) NOT NULL, birdh DATE NOT NULL, description LONGTEXT DEFAULT NULL, phone VARCHAR(255) NOT NULL, departement LONGTEXT DEFAULT NULL, photo VARCHAR(255) DEFAULT NULL, parrain LONGTEXT DEFAULT NULL, updated DATETIME NOT NULL, created_at DATETIME NOT NULL, token LONGTEXT NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', google_id NUMERIC(60, 0) DEFAULT NULL, category LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:array)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE email_statistics (id INT AUTO_INCREMENT NOT NULL, nbre INT NOT NULL, created_at DATETIME NOT NULL, object VARCHAR(255) NOT NULL, message LONGTEXT NOT NULL, type_envoi VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE seo (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, content VARCHAR(255) DEFAULT NULL, canonical VARCHAR(255) DEFAULT NULL, meta_title VARCHAR(255) DEFAULT NULL, robots VARCHAR(255) DEFAULT NULL, meta_desc VARCHAR(255) DEFAULT NULL, image VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, url VARCHAR(255) NOT NULL, updated DATETIME NOT NULL, og_title VARCHAR(255) NOT NULL, og_description VARCHAR(255) NOT NULL, keyword VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sms_statistics (id INT AUTO_INCREMENT NOT NULL, nbre INT NOT NULL, created_at DATETIME NOT NULL, message LONGTEXT NOT NULL, type_envoie VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, firstname VARCHAR(180) NOT NULL, lastname VARCHAR(180) NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, token VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ville (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, photo VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ville_publicity (id INT AUTO_INCREMENT NOT NULL, ville_id INT DEFAULT NULL, start DATE NOT NULL, end DATE NOT NULL, photo VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_EE42DE9BA73F0036 (ville_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE ville_publicity ADD CONSTRAINT FK_EE42DE9BA73F0036 FOREIGN KEY (ville_id) REFERENCES ville (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ville_publicity DROP FOREIGN KEY FK_EE42DE9BA73F0036');
        $this->addSql('DROP TABLE admin');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE email_statistics');
        $this->addSql('DROP TABLE seo');
        $this->addSql('DROP TABLE sms_statistics');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE ville');
        $this->addSql('DROP TABLE ville_publicity');
    }
}
