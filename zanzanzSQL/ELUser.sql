USE [Bz3PL]
GO

/****** Object:  Table [dbo].[ElUser]    Script Date: 2023/9/26 10:36:58 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ElUser](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[LoginId] [varchar](50) NOT NULL,
	[Passwrod] [image] NOT NULL,
	[Key] [image] NOT NULL,
	[Iv] [image] NOT NULL,
	[UserName] [nvarchar](50) NOT NULL,
	[Avatar] [varchar](200) NOT NULL,
	[Enabled] [bit] NOT NULL,
	[OwnerId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[ElUser] ADD  DEFAULT ('') FOR [Avatar]
GO

ALTER TABLE [dbo].[ElUser] ADD  DEFAULT ((0)) FOR [Enabled]
GO


