<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230323102859 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE commission (id INT AUTO_INCREMENT NOT NULL, advert_query_id INT DEFAULT NULL, baggagiste_query_id INT DEFAULT NULL, bagzee DOUBLE PRECISION NOT NULL, porteur DOUBLE PRECISION NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_1C6501586D36D518 (advert_query_id), UNIQUE INDEX UNIQ_1C650158CC699DE6 (baggagiste_query_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE commission ADD CONSTRAINT FK_1C6501586D36D518 FOREIGN KEY (advert_query_id) REFERENCES advert_query (id)');
        $this->addSql('ALTER TABLE commission ADD CONSTRAINT FK_1C650158CC699DE6 FOREIGN KEY (baggagiste_query_id) REFERENCES baggiste_query (id)');
        $this->addSql('DROP TABLE admin');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE commission DROP FOREIGN KEY FK_1C6501586D36D518');
        $this->addSql('ALTER TABLE commission DROP FOREIGN KEY FK_1C650158CC699DE6');
        $this->addSql('DROP TABLE commission');
    }
}
