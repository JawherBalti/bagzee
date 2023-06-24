<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230327091547 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE log_refund (id INT AUTO_INCREMENT NOT NULL, advert_query_id INT DEFAULT NULL, proprietaire INT NOT NULL, montant DOUBLE PRECISION NOT NULL, contraite LONGTEXT NOT NULL, INDEX IDX_4ED647FA6D36D518 (advert_query_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE log_refund ADD CONSTRAINT FK_4ED647FA6D36D518 FOREIGN KEY (advert_query_id) REFERENCES advert_query (id)');
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6AD07ECCB6');
        $this->addSql('DROP TABLE images');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE images (id INT AUTO_INCREMENT NOT NULL, advert_id INT DEFAULT NULL, url LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, INDEX IDX_E01FBE6AD07ECCB6 (advert_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AD07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id)');
        $this->addSql('ALTER TABLE log_refund DROP FOREIGN KEY FK_4ED647FA6D36D518');
        $this->addSql('DROP TABLE log_refund');
    }
}
