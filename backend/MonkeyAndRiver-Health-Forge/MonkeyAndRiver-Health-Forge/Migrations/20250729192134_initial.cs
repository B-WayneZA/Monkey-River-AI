using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MonkeyAndRiver_Health_Forge.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Result",
                table: "DiagnosticTests",
                newName: "HealthInfoJson");

            migrationBuilder.RenameColumn(
                name: "RawInput",
                table: "DiagnosticTests",
                newName: "AdditionalNotes");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "HealthInfoJson",
                table: "DiagnosticTests",
                newName: "Result");

            migrationBuilder.RenameColumn(
                name: "AdditionalNotes",
                table: "DiagnosticTests",
                newName: "RawInput");
        }
    }
}
