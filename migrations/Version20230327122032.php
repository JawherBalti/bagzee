<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230327122032 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE working (id INT AUTO_INCREMENT NOT NULL, client_id INT DEFAULT NULL, contenu TINYINT(1) NOT NULL, work TINYINT(1) NOT NULL, days INT NOT NULL, morning_from TIME NOT NULL, morning_to TIME DEFAULT NULL, afternoon_from TIME DEFAULT NULL, afternoon_to TIME NOT NULL, week INT NOT NULL, INDEX IDX_4D9A0D8419EB6921 (client_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE working ADD CONSTRAINT FK_4D9A0D8419EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6AD07ECCB6');
        $this->addSql('DROP TABLE images');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE images (id INT AUTO_INCREMENT NOT NULL, advert_id INT DEFAULT NULL, url LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, INDEX IDX_E01FBE6AD07ECCB6 (advert_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AD07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('ALTER TABLE working DROP FOREIGN KEY FK_4D9A0D8419EB6921');
        $this->addSql('DROP TABLE working');
    }
}
