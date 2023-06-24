<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230220112219 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE baggiste_query (id INT AUTO_INCREMENT NOT NULL, client_id INT DEFAULT NULL, contenu_transporter LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', prix DOUBLE PRECISION NOT NULL, status INT NOT NULL, INDEX IDX_4047E3F219EB6921 (client_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE baggiste_query_photo (id INT AUTO_INCREMENT NOT NULL, baggiste_query_id INT DEFAULT NULL, created_at DATETIME NOT NULL, url VARCHAR(255) NOT NULL, INDEX IDX_DFF880DD4DEA16D2 (baggiste_query_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE baggiste_query ADD CONSTRAINT FK_4047E3F219EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE baggiste_query_photo ADD CONSTRAINT FK_DFF880DD4DEA16D2 FOREIGN KEY (baggiste_query_id) REFERENCES baggiste_query (id)');
        $this->addSql('DROP TABLE admin');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE baggiste_query DROP FOREIGN KEY FK_4047E3F219EB6921');
        $this->addSql('ALTER TABLE baggiste_query_photo DROP FOREIGN KEY FK_DFF880DD4DEA16D2');
        $this->addSql('DROP TABLE baggiste_query');
        $this->addSql('DROP TABLE baggiste_query_photo');
    }
}
